import React from "react";
import UserRoleCard from "./components/UserCardRole";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <UserRoleCard />
    </div>
  );
};

export default Home;
