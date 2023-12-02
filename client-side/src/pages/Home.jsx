import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="container">
        <div className="row p-5">
          <div className="col-12">
            <h1 className="text-center p-5">Welcome to WeTravel Admin Panel</h1>
            <p className="mt-5 text-center">
              <Link to="/login" style={{background: '#ff5522', color: '#fff'}} className="mb-5 text-center btn btn-warning">
                Please Login to Access all Admin Features
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
