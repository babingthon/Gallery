import { useState, useEffect, FormEvent, useRef } from 'react'
import * as C from './App.styles'
import * as Photos from './services/photos';
import { Photo } from './types/Photo'
import { PhotoItem } from './components/PhotoItem';

const App = () => {
  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listPhotos, setListPhotos] = useState<Photo[]>([])

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = async () => {
    setLoading(true);
    setListPhotos(await Photos.getAll());
    setLoading(false);
  };
  
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      setUpload(true);
      let result = await Photos.addFile(file);
      setUpload(false);

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newListPhoto = [...listPhotos];
        newListPhoto.push(result);
        setListPhotos(newListPhoto);
      };
    };
  };

  const handleDeleteClick = async (name: string) => {
    await Photos.deleleFile(name);
    getPhotos();
  };
  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {upload && "Enviando..."}
        </C.UploadForm>

        {loading && (
          <C.Loading>
            <div className="emoji">😎</div>
            <div>Carregando...</div>
          </C.Loading>
        )}

        {!loading && listPhotos.length > 0 && (
          <C.PhotoList>
            {listPhotos.map((item, index) => (
              <PhotoItem
                key={index}
                url={item.url}
                name={item.name}
                onDelete={handleDeleteClick}
              />
            ))}
          </C.PhotoList>
        )}

        {!loading && listPhotos.length === 0 && (
          <C.Loading>
            <div className="emoji">😔</div>
            <div>Não a fotos cadastradas.</div>
          </C.Loading>
        )}
      </C.Area>
    </C.Container>
  );
}

export default App; 