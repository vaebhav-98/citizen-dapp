import { SparklesIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ navigation }) => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-gray-900 shadow-xl">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
 
        <div className="flex h-16 items-center space-x-2 text-white text-2xl font-semibold">
          <SparklesIcon className="h-7 w-7 text-indigo-400" />
          <span className="tracking-wide">
            Citizen <span className="text-indigo-400">DApp</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col mt-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-gray-800 text-white border-l-4 border-indigo-500 scale-[1.03]"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white hover:border-l-4 hover:border-indigo-400",
                      "group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium transition-all duration-200 ease-in-out"
                    )
                  }
                >
                  <item.icon className="w-6 h-6 shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
