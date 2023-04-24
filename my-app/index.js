import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Conditionally render the app for web or native
if (typeof document !== 'undefined') {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}

export default App;
