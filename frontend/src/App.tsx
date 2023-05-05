import { useEffect, useState } from 'react';
import Nav from './Nav';
import Search from './Search';
import { Navigate, Routes, Route } from 'react-router-dom';
import Favorites from './Favorites';

export default function App() {
  const [favorites, setFavorites] = useState(getFavorites());

  function getFavorites() {
    const item = localStorage.getItem('favorites');
    const favorites = item ? JSON.parse(item) : {};
    return favorites;
  }
  function setFavoritesUtil(event: any, operation: string) {
    console.log('favorites');
    let temp = { ...favorites };

    if (operation == 'add') {
      temp[event.name] = event;
    }
    else {
      delete temp[event.name];
    }

    localStorage.setItem('favorites', JSON.stringify(temp));
    alert(operation == 'add' ? 'Event added to Favorites' : 'Event removed from Favorites');
    setFavorites(temp);
  }
  
  return (
    <>
      <div className='bg-[url(background.jpg)] w-screen h-screen bg-cover bg-center bg-no-repeat z-[-1] top-0 absolute' />
      <div className='w-screen h-screen fixed top-0 overflow-auto' id='container'>
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path='/search' element={<Search favorites={favorites} setFavorites={setFavoritesUtil} />} />
          <Route path='/favorites' element={<Favorites favorites={favorites} setFavorites={setFavoritesUtil} />} />
        </Routes>
      </div>
    </>
  );
}
