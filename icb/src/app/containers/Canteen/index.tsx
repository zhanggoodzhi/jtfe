import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Main from './Main';
import Detail, { detailTabsMenus } from './Detail';
import SampleDetail from './Detail/Sample/Detail';
import RawMaterialDetail from './Detail/RawMaterial/Detail';
import RawMaterialSource from './Detail/RawMaterial/Source';
import QualificationsDetailEmployees from './Detail/Qualifications/Detail/Employees';
import QualificationsDetailSecurity from './Detail/Qualifications/Detail/Security';

export default () => {
  return (
    <Switch>
      <Route path="/home/canteen" component={Main} exact />

      <Route path="/home/canteen/:canteen(\d+)/sample/:sampleId(\d+)" component={SampleDetail} exact />

      <Route path="/home/canteen/:canteen(\d+)/rawMaterial/:rawMaterialType/:rawMaterialId(\d+)/:sourceId(\d+)" component={RawMaterialSource} exact />

      <Route path="/home/canteen/:canteen(\d+)/rawMaterial/:rawMaterialType/:rawMaterialId(\d+)" component={RawMaterialDetail} exact />

      <Route path="/home/canteen/:canteen(\d+)/qualifications/employees/:id(\d+)" component={QualificationsDetailEmployees} exact />

      <Route path="/home/canteen/:canteen(\d+)/qualifications/security/:id(\d+)" component={QualificationsDetailSecurity} exact />

      <Route path="/home/canteen/:canteen(\d+)/:tab?" component={Detail} />

      <Redirect to="/home/404" />
    </Switch>
  );
};
