import { useEffect, useMemo, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      total: 0,
      students: 0,
      teachers: 0,
      admins: 0,
    });

  const token =
    localStorage.getItem("token");

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("role");

      window.location.href = "/";

      return;
    }
  }, [token]);

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://finalproject-bdk1.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /* TOKEN EXPIRED */

      if (res.status === 401) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "role"
        );

        window.location.href = "/";

        return;
      }

      const result =
        await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch users"
        );
      }

      const usersData =
        result.data || [];

      setUsers(usersData);

      setStats({
        total:
          usersData.length,

        students:
          usersData.filter(
            (u) =>
              u.role ===
              "student"
          ).length,

        teachers:
          usersData.filter(
            (u) =>
              u.role ===
              "teacher"
          ).length,

        admins:
          usersData.filter(
            (u) =>
              u.role ===
              "admin"
          ).length,
      });
    } catch (err) {
      console.error(
        "Fetch error:",
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  /* ================= UPDATE ROLE ================= */

  const updateRole =
    async (
      userId,
      newRole
    ) => {
      try {
        const res =
          await fetch(
            `https://finalproject-bdk1.onrender.com/api/admin/users/${userId}/role`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                role: newRole,
              }),
            }
          );

        const result =
          await res.json();

        if (!res.ok) {
          throw new Error(
            result.message
          );
        }

        fetchUsers();
      } catch (err) {
        console.error(
          "Role update error:",
          err.message
        );
      }
    };

  /* ================= BLOCK USER ================= */

  const toggleBlock =
    async (
      userId,
      isBlocked
    ) => {
      try {
        const endpoint =
          isBlocked
            ? "unblock"
            : "block";

        const res =
          await fetch(
            `https://finalproject-bdk1.onrender.com/api/admin/users/${userId}/${endpoint}`,
            {
              method: "PUT",

              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const result =
          await res.json();

        if (!res.ok) {
          throw new Error(
            result.message
          );
        }

        fetchUsers();
      } catch (err) {
        console.error(
          "Block error:",
          err.message
        );
      }
    };

  /* ================= FILTER USERS ================= */

  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (u) => {
          const searchMatch =
            (
              u.email || ""
            )
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const roleMatch =
            filter === "all" ||
            u.role === filter;

          return (
            searchMatch &&
            roleMatch
          );
        }
      );
    }, [
      users,
      search,
      filter,
    ]);

  /* ================= LOADING ================= */

  if (
    loading &&
    users.length === 0
  ) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center text-2xl font-bold">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

        <div>

          <h1 className="text-5xl font-black">
            Admin Dashboard
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Manage users, roles and platform access.
          </p>

        </div>

        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 rounded-3xl shadow-2xl">

          <p className="text-sm text-violet-100">
            Total Users
          </p>

          <h2 className="text-4xl font-black mt-1">
            {stats.total}
          </h2>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-[#111827] border border-white/10 rounded-[28px] p-6">

          <p className="text-gray-400 text-sm">
            Students
          </p>

          <h2 className="text-5xl font-black mt-3 text-emerald-400">
            {stats.students}
          </h2>

        </div>

        <div className="bg-[#111827] border border-white/10 rounded-[28px] p-6">

          <p className="text-gray-400 text-sm">
            Teachers
          </p>

          <h2 className="text-5xl font-black mt-3 text-blue-400">
            {stats.teachers}
          </h2>

        </div>

        <div className="bg-[#111827] border border-white/10 rounded-[28px] p-6">

          <p className="text-gray-400 text-sm">
            Admins
          </p>

          <h2 className="text-5xl font-black mt-3 text-fuchsia-400">
            {stats.admins}
          </h2>

        </div>

      </div>

      {/* FILTER BAR */}

      <div className="bg-[#111827] border border-white/10 rounded-[28px] p-5 mb-8">

        <div className="flex flex-col lg:flex-row gap-4">

          <input
            type="text"
            placeholder="Search users by email..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="flex-1 bg-[#0b1120] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="bg-[#0b1120] border border-white/10 rounded-2xl px-5 py-4 outline-none"
          >
            <option value="all">
              All Roles
            </option>

            <option value="student">
              Student
            </option>

            <option value="teacher">
              Teacher
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

        </div>

      </div>

      {/* USER TABLE */}

      <div className="space-y-5">

        {filteredUsers.map(
          (user) => (
            <div
              key={user._id}
              className="bg-[#111827] border border-white/10 rounded-[30px] p-6 shadow-2xl hover:border-violet-500/30 transition"
            >

              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                {/* USER INFO */}

                <div>

                  <h2 className="text-2xl font-bold">
                    {user.name ||
                      "Unnamed User"}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    {user.email}
                  </p>

                  <div className="flex gap-3 mt-4 flex-wrap">

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user.role ===
                        "admin"
                          ? "bg-red-500/20 text-red-400"
                          : user.role ===
                            "teacher"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user.isBlocked
                          ? "bg-red-500/20 text-red-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {user.isBlocked
                        ? "BLOCKED"
                        : "ACTIVE"}
                    </div>

                  </div>

                </div>

                {/* ANALYTICS */}

                <div className="flex gap-6 flex-wrap">

                  <div>

                    <p className="text-gray-400 text-sm">
                      Problems Solved
                    </p>

                    <h2 className="text-3xl font-black mt-2">
                      {user.problemsSolved ||
                        0}
                    </h2>

                  </div>

                  <div>

                    <p className="text-gray-400 text-sm">
                      Contest Score
                    </p>

                    <h2 className="text-3xl font-black mt-2 text-violet-400">
                      {user.contestScore ||
                        0}
                    </h2>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-col gap-4 min-w-[220px]">

                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(
                        user._id,
                        e.target.value
                      )
                    }
                    className="bg-[#0b1120] border border-white/10 rounded-2xl px-4 py-3 outline-none"
                  >
                    <option value="student">
                      Student
                    </option>

                    <option value="teacher">
                      Teacher
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                  <button
                    onClick={() =>
                      toggleBlock(
                        user._id,
                        user.isBlocked
                      )
                    }
                    className={`px-5 py-3 rounded-2xl font-semibold transition ${
                      user.isBlocked
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.isBlocked
                      ? "Unblock User"
                      : "Block User"}
                  </button>

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* EMPTY */}

      {filteredUsers.length ===
        0 &&
        !loading && (
          <div className="bg-[#111827] border border-white/10 rounded-[28px] p-12 text-center text-gray-400 mt-8">

            No users found.

          </div>
        )}

    </div>
  );
}