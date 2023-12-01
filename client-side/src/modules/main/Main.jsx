import {useState, useEffect, useCallback} from 'react';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {addWindowClass, removeWindowClass} from '@app/utils/helpers';
import Header from '@app/modules/main/header/Header';
import MenuSidebar from '@app/modules/main/menu-sidebar/MenuSidebar';
import Footer from '@app/modules/main/footer/Footer';
import {PfImage} from '@profabric/react-components';

const Main = () => {
  const menuSidebarCollapsed = useSelector(
    (state) => state.ui.menuSidebarCollapsed
  );
  const controlSidebarCollapsed = useSelector(
    (state) => state.ui.controlSidebarCollapsed
  );
  const screenSize = useSelector((state) => state.ui.screenSize);
  const authentication = useSelector((state) => state.auth.authentication);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    setIsAppLoaded(Boolean(userInfo.isAdmin));
  }, [userInfo]);

  useEffect(() => {
    removeWindowClass('register-page');
    removeWindowClass('login-page');
    removeWindowClass('hold-transition');

    addWindowClass('sidebar-mini');
    return () => {
      removeWindowClass('sidebar-mini');
    };
  }, []);

  useEffect(() => {
    removeWindowClass('sidebar-closed');
    removeWindowClass('sidebar-collapse');
    removeWindowClass('sidebar-open');
    if (menuSidebarCollapsed && screenSize === 'lg') {
      addWindowClass('sidebar-collapse');
    } else if (menuSidebarCollapsed && screenSize === 'xs') {
      addWindowClass('sidebar-open');
    } else if (!menuSidebarCollapsed && screenSize !== 'lg') {
      addWindowClass('sidebar-closed');
      addWindowClass('sidebar-collapse');
    }
  }, [screenSize, menuSidebarCollapsed]);

  useEffect(() => {
    if (controlSidebarCollapsed) {
      removeWindowClass('control-sidebar-slide-open');
    } else {
      addWindowClass('control-sidebar-slide-open');
    }
  }, [screenSize, controlSidebarCollapsed]);

  const getAppTemplate = useCallback(() => {
    if (!isAppLoaded) {
      return (
        <div className="preloader flex-column justify-content-center align-items-center">
          <PfImage
            className="animation__shake"
            src="/img/logo.jpg"
            alt="AdminLTELogo"
            height={60}
            width={60}
          />
        </div>
      );
    }
    return (
      <>
        <Header />

        <MenuSidebar />

        <div className="content-wrapper">
          <div className="pt-3" />
          <section className="content">
            <Outlet />
          </section>
        </div>
        <Footer />
      </>
    );
  }, [isAppLoaded]);

  return <div className="wrapper">{getAppTemplate()}</div>;
};

export default Main;
