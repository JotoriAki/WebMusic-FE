import About from '../Show/About/About';
import DetailSong from '../Show/DetailSong/DetailSong';
import Feed from '../Show/Feed/Feed';
import Home from '../Show/Home/Home';
import Library from '../Show/Library/Library';
import Playlist from '../Show/Playlist/Playlist';
import Profile from '../Show/Profile/Profile';
import Search from '../Show/SearchSong/Search';
import Setting from '../Show/SettingUser/Setting';
import Upload from '../Show/Upload/Upload';

// Public routes
const publicRoutes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/search', component: Search },
  { path: '/song/:songID', component: DetailSong },
  { path: '/playlist/:playlistId', component: Playlist },
  { path: '/profile/:nameunique', component: Profile },
  { path: '/feed', component: Feed },
];

const privateRoutes = [
  { path: '/upload', component: Upload },
  { path: '/library', component: Library },
  { path: '/setting', component: Setting },
];

export { privateRoutes, publicRoutes };
