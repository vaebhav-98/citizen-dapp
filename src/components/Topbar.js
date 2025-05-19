
import { Bars3BottomLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";

const Topbar = (props) => {
  return (
    <>
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow notranslate">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          onClick={() => props.setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex flex-1 justify-between px-4 z-50">
          <div className="flex flex-1 z-50"></div>
          <div className="ml-4 flex items-center md:ml-6">
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center space-x-2 text-white text-2xl font-semibold">
                <SparklesIcon className="h-7 w-7 text-indigo-400" />
                <span className="tracking-wide">
                  Citizen <span className="text-indigo-400">DApp</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Topbar;
