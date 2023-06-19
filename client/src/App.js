import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Login, Chat, SetAvatar, AddContact } from "./pages";
import Scaffolding from "./components/Scaffolding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />

        <Route path="/" element={<Scaffolding />}>
          <Route index element={<Chat />} />
          <Route path="/addContact" element={<AddContact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
