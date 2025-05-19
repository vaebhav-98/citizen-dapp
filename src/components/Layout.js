import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  XMarkIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon, current: false },
    {
      name: "Add Citizens",
      href: "/add",
      current: false,
      icon: UsersIcon,
    },
  ];

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center space-x-2 text-white text-2xl font-semibold">
                        <SparklesIcon className="h-7 w-7 text-indigo-400" />
                        <span className="tracking-wide">
                            Citizen <span className="text-indigo-400">DApp</span>
                        </span>
                    </div>
                </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item, idx) => {
                        return (
                          <Link to={item.href} key={idx}>
                            <div
                              className={classNames(
                                item.href === window.location.pathname
                                  ? "bg-gray-200 text-gray-800"
                                  : "text-gray-800 hover:bg-gray-100",
                                "group flex items-center px-2 py-1.5 text-sm font-medium rounded-sm"
                              )}
                            >
                              <div className="items-center flex flex-shrink-0 mr-4 text-gray-700">
                                <span
                                  aria-hidden="true"
                                  className="inline-block flex-shrink-0 leading-none w-6 h-6"
                                >
                                  <item.icon
                                    className=" h-6 w-6 flex-shrink-0 text-red-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </div>
                              <div className="flex flex-grow flex-col overflow-x-hidden">
                                <div className="whitespace-no-wrap overflow-hidden text-gray-700">
                                  {item.name}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* {/ Dummy element to force sidebar to shrink to fit close icon /} */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <Sidebar
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          setIsActive={setIsActive}
          isActive={isActive}
        />
        <div className="flex flex-1 flex-col md:pl-64">
          <Topbar setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 bg-gray-100 notranslate">
            <div className="py-2">
              <div className="max-w-9xl sm:px-6 md:px-0 mx-14 mt-4">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default Layout;
