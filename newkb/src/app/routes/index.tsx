import { RouteConfig } from 'react-router-config';
import MainLayout from 'containers/MainLayout';
import Framework from 'containers/Framework';
import Search from 'containers/Search';
import Configuration from 'containers/Configuration';
import Repository from 'containers/Repository';
import NotFound from 'containers/NotFound';

const routes: RouteConfig[] = [{
  component: MainLayout,
  routes: [
    {
      path: '/framework',
      component: Framework
    }, {
      path: '/search',
      component: Search
    }, {
      path: '/configuration',
      component: Configuration
    }, {
      path: '/repository',
      component: Repository
    }, {
      component: NotFound
    }
  ]
}];
export default routes;
