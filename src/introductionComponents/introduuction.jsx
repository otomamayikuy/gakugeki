import './intro.css';
import Header from './header.jsx';
import Hooder from './hooder.jsx';
import Top from './top.jsx';
import Activities from './activities.jsx';
import OrganizationChart from './organization_chart.jsx';
import Menbers from './menbers.jsx';
import Groups from './paticipatingGroups';

function Introduction() {
  return (
    <div className="page">
    <Top/>
    <Header/>
    <Activities/>
    <OrganizationChart/>
    <Menbers/>
    <Groups/>
    <Hooder/>
    </div>
  );
}

export default Introduction;
