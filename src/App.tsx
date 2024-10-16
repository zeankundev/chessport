import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './resources/fonts/grenadine.css'
import Button from './components/Button';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ChessportLogo from './components/ChessportLogo';
import Gameplay from './pages/Gameplay';
import ActionButton from './components/ActionButton';

function App() {
  const Sidebar = useRef<HTMLDivElement>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  return (
    <Router>
      <div className='main'>
        <header className='main-header'>
          <ActionButton
            icon='menu'
            action={handleToggleSidebar}
            isToggleable={true}
            isReversibleState={true}
          />
          <Link to='/'>
            <ChessportLogo />
          </Link>
        </header>
        <div className='main-body'>
          <aside className={isSidebarVisible ? 'visible' : 'hidden'} ref={Sidebar}>
            <Button icon='home' path='/' />
            <Button icon='chess' path='/play' />
            <Button icon='book' path='/learn' />
          </aside>
          <div className='main-content'>
            <Switch>
              <Route exact path='/' component={Home}></Route>
              <Route path='/play' component={Gameplay}></Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
