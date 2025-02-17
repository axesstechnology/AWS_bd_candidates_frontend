// import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Search icon
// import logo from '../../assets/logo/logo.png';
import DropdownUser from '../../components/header/DropdownUser';
import DropdownMessage from '../header/DropdownMessage';
import DropdownNotification from './DropdownNotification';
import { RxHamburgerMenu } from "react-icons/rx";

// import DarkModeSwitcher from './DarkModeSwitcher';

const Header = ({ sidebarOpen, setSidebarOpen }: any) => {
  return (
    <header className="sticky top-0 z-10 flex w-full bg-white shadow-xl drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
       {/* Hamburger Toggle BTN */}
       <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <RxHamburgerMenu />

          </button>
          {/* Hamburger Toggle BTN */}

          {/* <Link className="block flex-shrink-0 lg:hidden" to="/">
            <img src={logo} alt="Logo" width={60}/>
          </Link> */}
        </div>

        <div className="invisible">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <FaSearch className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" size={20} />
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-10 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            {/* <DarkModeSwitcher /> */}
            {/* Dark Mode Toggler */}

            {/* Notification Menu Area */}
            {/* <DropdownNotification /> */}
            {/* Notification Menu Area */}

            {/* Chat Notification Area */}
            {/* <DropdownMessage /> */}
            {/* Chat Notification Area */}
            <li>

            </li>

          </ul>

          {/* User Area */}
          <DropdownUser />
          {/* User Area */}
        </div>
      </div>
    </header>
  );
};

export default Header;