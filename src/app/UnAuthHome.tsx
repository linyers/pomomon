import { useNavigate } from "react-router";
import { useUserStore } from "../store/user";

export default function UnAuthHome() {
  window.history.pushState({}, "", "/");

  const setDefaultUser = useUserStore((state) => state.setDefaultUser);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameInput = e.currentTarget.name;
    const name = nameInput && nameInput.value.trim();
    if (!name) return;
    setDefaultUser(name);
  };

  return (
    <main>
      <h1>Pomomon</h1>
      <p>
        Unlock productivity with Pomomon – your companion for focused goals.
      </p>
      <div>
        <p>
          Create your account below; your account will be saved locally on your
          device.
        </p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your username..." />
          <button>Enter to Pomomon</button>
        </form>
      </div>
    </main>
  );
}
