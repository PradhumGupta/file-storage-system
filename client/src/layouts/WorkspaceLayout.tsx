// // src/layouts/WorkspaceLayout.tsx
// import { Outlet, useParams } from "react-router-dom";
// import WorkspaceProvider from "@/contexts/WorkspaceProvider";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// export default function WorkspaceLayout() {
//   const { workspaceName } = useParams();

//   if (!workspaceName) return <div>Invalid workspace</div>;

//   return (
//     <WorkspaceProvider workspaceName={workspaceName}>
//       <div className="flex h-screen">
//         <Sidebar />
//         <div className="flex-1 flex flex-col">
//           <Topbar />
//           {/* All child routes render here */}
//           <main className="p-4 flex-1 overflow-auto">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </WorkspaceProvider>
//   );
// }
