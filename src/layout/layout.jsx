import Navbar from "../layout/navbar/navbar";
import Suggestion from "../component/suggestion";

export const Layout = ({ Component, suggetion = true }) => {
  return (
    <div className="flex w-full min-h-screen bg-bg-default">
      {/* Left Sidebar - Navigation */}
        <Navbar />
      
      {/* Content Area */}
      <div className="flex-1 flex min-h-screen ">
        {/* Main Content */}
        <main className="flex-1 flex justify-center min-h-screen border-x border-border-default">
          <div className="w-full max-w-[600px] mt-10">
            <Component />
          </div>
        </main>

        {/* Right Sidebar - Suggestions */}
        {suggetion && (
          <aside className="hidden lg:block w-[350px] min-h-screen border-l border-border-default">
            <div className="sticky top-0 h-screen overflow-y-auto scroll-hidden">
              <div className="p-4">
                <Suggestion />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
