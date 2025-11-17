import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Export User interface
export interface User {
  name: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>; // <- đây mới cho phép prev => {...}
}

const UserContext = createContext<UserContextType>({
  user: { name: "User", avatar: "" },
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ name: "User", avatar: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
