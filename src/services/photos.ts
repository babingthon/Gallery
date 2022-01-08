import { Photo } from '../types/Photo';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject  } from 'firebase/storage';
import { v4 as createId} from 'uuid'

const imagensFolder = ref(storage, 'images');

export const getAll = async () => {
    let list: Photo[] = [];
    
    const photoList = await listAll(imagensFolder);

    for (let i in photoList.items) {
        let photoUrl = await getDownloadURL(photoList.items[i]);

        list.push({
            name: photoList.items[i].name,
            url: photoUrl
        })
    }

    return list;
};

export const addFile = async (file: File) => {
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {

        let randomName = createId();
        let newFile = ref(storage, `images/${randomName}`);

        let upload = await uploadBytes(newFile, file);
        let photoUrl = await getDownloadURL(upload.ref);

        return { name: upload.ref.name, url: photoUrl } as Photo;
        
    } else {
        return new Error('Tipo de arquivo não permitido.');
    }
};

export const deleleFile = async (name: string) => {
    const fileName = ref(storage, `images/${name}`);
    
    let result = await deleteObject(fileName);

    return result;
};