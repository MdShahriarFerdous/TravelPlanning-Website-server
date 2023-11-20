import {Link} from 'react-router-dom';

/* eslint-disable react/prop-types */
const SmallBox = ({type,icon,count,title, navigateTo}) => {
  return (
    <div className={`small-box bg-${type}`}>
      <div className="inner">
        <h3>{count}</h3>
        <p>{title}</p>
      </div>
      <div className="icon">
        <i className={`ion ${icon || 'ion-bag'}`} />
      </div>
      <Link to={navigateTo} className="small-box-footer">
        <span className="mr-2">More info</span>
        <i className="fa fa-arrow-circle-right" />
      </Link>
    </div>
  );
};

export default SmallBox;
