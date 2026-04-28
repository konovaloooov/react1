import { ReactNode, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { clearError } from "../store/slices/errorSlice";
import { fetchMe, logout, setInitialized } from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Button } from "../ui/Button";
import { getToken } from "../utils/tokenStorage";

interface CommonWrapperProps {
  children: ReactNode;
}

export function CommonWrapper({ children }: CommonWrapperProps) {
  const dispatch = useAppDispatch();
  const { isAuth, currentUser, isInitialized } = useAppSelector(
    (state) => state.user,
  );
  const { isLoading } = useAppSelector((state) => state.loading);
  const { message } = useAppSelector((state) => state.error);

  useEffect(() => {
    const token = getToken();

    if (token && !isInitialized) {
      dispatch(fetchMe());
      return;
    }

    if (!token && !isInitialized) {
      dispatch(setInitialized());
    }
  }, [dispatch, isInitialized]);

  return (
    <div className="app-shell">
      <Navbar
        isAuth={isAuth}
        currentUser={currentUser}
        onLogout={() => dispatch(logout())}
      />

      {isLoading && <div className="loader">Загрузка...</div>}

      {message && (
        <div className="modal">
          <div className="modal-box">
            <h3>Ошибка</h3>
            <p>{message}</p>
            <Button onClick={() => dispatch(clearError())}>Закрыть</Button>
          </div>
        </div>
      )}

      <main className="container py-4">{children}</main>
    </div>
  );
}
