import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import fetchImages from '../services/images-api';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';


function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState(false);
  const [error, setError] = useState(false);
  const [imagesOnPage, setImagesOnPage] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [currentImageDescription, setCurrentImageDescription] = useState(null);

  useEffect(() => {
    if (query !== '') {
      setIsLoading(true);

      fetchImages(query)
        .then(({ hits, totalHits }) => {
          const imagesArray = hits.map(hit => ({
            id: hit.id,
            description: hit.tags,
            smallImage: hit.webformatURL,
            largeImage: hit.largeImageURL,
          }));

          return (
            setPage(1),
            setImages(imagesArray),
            setImagesOnPage(imagesArray.length),
            setTotalImages(totalHits)
          );
        })
        .catch(error => setError(error))
        .finally(() => setIsLoading(false));
    }

    if (page !== 1) {
      setIsLoading(true);

      fetchImages(query, page)
        .then(({ hits }) => {
          const imagesArray = hits.map(hit => ({
            id: hit.id,
            description: hit.tags,
            smallImage: hit.webformatURL,
            largeImage: hit.largeImageURL,
          }));
          console.log(imagesArray);
          return (
            setImages(prevImages => [...prevImages, ...imagesArray]),
            setImagesOnPage(
              prevImagesOnPage => prevImagesOnPage + imagesArray.length
            )
          );
        })
        .catch(error => setError(error))
        .finally(() => setIsLoading(false));
    }
  }, [query, page, error]);


  const handleFormSubmit = query => setQuery(query);

  const onNextFetch = () => setPage(page => page + 1);

  const openModal = event => {
    const currentImageUrl = event.target.dataset.large;
    const currentImageDescription = event.target.alt;
    // console.log(currentImageUrl);
    // console.log(currentImageDescription);

    if (event.target.nodeName === 'IMG') {
      setShowModal(true);
      setCurrentImageUrl(currentImageUrl);
      setCurrentImageDescription(currentImageDescription);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />

      {images && <ImageGallery images={images} openModal={openModal} />}

      {isLoading && <Loader />}

      {imagesOnPage >= 12 && imagesOnPage < totalImages && (
        <Button onNextFetch={onNextFetch} />
      )}

      {showModal && (
        <Modal
          onClose={closeModal}
          currentImageUrl={currentImageUrl}
          currentImageDescription={currentImageDescription}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
