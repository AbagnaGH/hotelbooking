import Link from 'next/link';
import { Fragment } from 'react';

const Footer = () => {
  return (
    <Fragment>
      <footer className="py-1 footer fixed-bottom">
        <nav className="navbar row justify-content-center sticky-top">
          <div className="container-fluid">
            <div className="col-3 p-0">
              <div className="navbar-brand">
                <p className="lead  display-6">Copyright © 2021 Blue Plannet</p>
              </div>
            </div>

            <div className="col-3 mt-md-0 cp">
              <p className="lead display-6">Powered by Code Smart Websoft </p>
            </div>
          </div>
        </nav>
        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <p className=" mt-1">Copyright © 2021 Eusbett Hotel</p>
            </div>
            <div className="col-md-6 mt-md-0 ">
              <p className=" mt-1 ">
                <a
                  className="dropdown-item"
                  href="codesmartacady.com"
                  target="blank"
                >
                  Code Smart Websoft
                </a>
              </p>
            </div>
          </div>
        </div> */}
      </footer>
    </Fragment>
  );
};

export default Footer;
