const Menu = [
  {
    name: "Dashboard",
    icon: "fas fa-tachometer-alt nav-icon",
    path: "/dashboard",
  },
  {
    name: "Users",
    icon: "fas fa-solid fa-users nav-icon",
    path: "/users",
  },
  {
    name: "Blogs",
    icon: "fas fa-solid fa-blog nav-icon",
    children: [
      {
        name: "All Blog",
        icon: "fas fa-solid fa-list-ul nav-icon",
        path: "/blogs",
      },
      {
        name: "Add New Blog",
        icon: "fas fa-solid fa-plus nav-icon",
        path: "/create-blog",
      },
    ],
  },
  {
    name: "Reviews",
    icon: "fas fa-regular fa-comments nav-icon",
    children: [
      {
        name: "All Review",
        icon: "fas fa-solid fa-list-ul nav-icon",
        path: "/reviews",
      },
      {
        name: "Add New Review",
        icon: "fas fa-solid fa-plus nav-icon",
        path: "/create-review",
      },
    ],
  },
];
export default Menu;
