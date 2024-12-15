import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserProvider from './context/UserProvider.js'
import NavigationBar from './components/navbar/NavigationBar.js'
import Footer from './components/footer/Footer.js'

// Pages import
import ErrorPage from './pages/ErrorPage.js'
import Home from './pages/Home.js'
import Reviews from './pages/Reviews.js'
import Groups from './pages/Groups.js'
import Group from './pages/Group.js'
import ShowTimes from './pages/ShowTimes.js'
import Members from './pages/Members.js'
import FavoritesPage from './pages/FavoritesPage.js'
import Movie from './pages/Movie.js'
import LoginPage, { AuthenticationMode } from './pages/LoginPage.js'
import Collection from './pages/Collection.js'
import ProfilePage from './pages/AccountPage.js'
import DeleteProfile from './pages/DeleteProfile.js'

// Front-end routing 
const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
        <NavigationBar />
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/reviews", element: <Reviews /> },
      { path: "/groups", element: <Groups /> },
      { path: "/showtimes", element: <ShowTimes /> },
      { path: "/signin", element: <LoginPage authenticationMode={AuthenticationMode.Login} /> },
      { path: "/signup", element: <LoginPage authenticationMode={AuthenticationMode.Register} /> },

      { path: "/account/:id", element: <ProfilePage /> },
      { path: "/members", element: <Members /> },
      
      { path: "/favorites/:id", element: <FavoritesPage /> },
      { path: "/movie/:id", element: <Movie /> },
      { path: "/collection/:id", element: <Collection /> },
      { path: "/group/:id", element: <Group /> },
      { path: "/delete", element: <DeleteProfile /> },

      { path: "/error", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <div className="app-container"> {/* Flex container for the entire app */}
        <RouterProvider router={router} />
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;


/* Example for later for a route that would need a token check before opening the page 
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: ,
      }
    ]
  } */