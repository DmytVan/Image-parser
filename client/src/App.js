import React from 'react';
import AlbumPage from './components/AlbumPage'
import './App.css';
import {createStore} from 'redux';
import mainReducer from './store/reducers';
import {Provider} from 'react-redux';

const store = createStore(mainReducer);

function App() {
    return (
        <Provider store={store}>
            <AlbumPage />
        </Provider>
    );
}

export default App;
