import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import { Home } from './page/home';
import signuppage from './page/signuppage';
import { Loginpage } from './page/loginpage';
import CreateAccount from './page/create-account';
import { useState } from 'react';
import { UserDataProvider } from './service/context/usercontext';
import Setting from './page/setting';
import { ToastContainer } from 'react-toastify';
import { Profilepage } from './page/profilepage';
import Notification from './page/notification';
import Seepost from './page/seepost';
import Search from './page/search';
import Notfound from './page/not-found';
import { Layout } from './layout/layout';
import { List } from './page/list';

function App() {
   const [userdata, setuserdata] = useState(null);
   return (
      <UserDataProvider
         value={userdata}
         setvalue={setuserdata}>
         <div className='min-h-screen bg-bg-default'>
            <div className='w-full max-w-7xl mx-auto'>
               <ToastContainer
                  position='top-center'
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme='dark'
                  toastClassName='bg-bg-tertiary border border-border-default rounded-xl'
                  progressClassName='bg-accent-500'
                  bodyClassName='text-text-primary font-medium'
               />

               <Routes>
                  <Route
                     exact
                     path='/'
                     Component={signuppage}
                  />
                  <Route
                     exact
                     path='/login'
                     Component={Loginpage}
                  />
                  <Route
                     path='/home'
                     element={<Layout Component={Home} />}
                  />
                  <Route
                     exact
                     path='/create-account'
                     Component={CreateAccount}
                  />
                  <Route
                     exact
                     path='/search'
                     element={<Layout Component={Search} />}
                  />
                  <Route
                     exact
                     path='/profile/:username'
                     element={<Layout Component={Profilepage} />}
                  />
                  <Route
                     exact
                     path='/profile/:username/:postid'
                     element={<Layout Component={Seepost} />}
                  />
                  {userdata && (
                     <Route
                        exact
                        path='/setting'
                        element={
                           <Layout
                              Component={Setting}
                              suggetion={false}
                           />
                        }
                     />
                  )}
                  {userdata && (
                     <Route
                        exact
                        path='/notification'
                        element={<Layout Component={Notification} />}
                     />
                  )}
                  {userdata && (
                     <Route
                        exact
                        path='/lists'
                        element={<Layout Component={List} />}
                     />
                  )}
                  <Route
                     path='*'
                     Component={Notfound}
                  />
               </Routes>
            </div>
         </div>
      </UserDataProvider>
   );
}

export default App;
