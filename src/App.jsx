import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import PostDetail from "@/components/pages/PostDetail";
import CommunityPage from "@/components/pages/CommunityPage";
import CreatePost from "@/components/pages/CreatePost";
import UserProfile from "@/components/pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/r/:communityName" element={<CommunityPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;