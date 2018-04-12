import React, { Component } from 'react';
import { Provider } from 'react-redux';
 
import store from './store'; //Import the store
import Home from './components/home' //Import the component file
 
export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Home />
            </Provider>
        );
    }
}