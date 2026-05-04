import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= CHANGE ROLE ================= */
  const changeRole = async (email, role) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/change-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      fetchUsers();
    } catch (err) {
      console.error("Change role error:", err.message);
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (email) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  /* ================= FILTER ================= */
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👑 Admin Dashboard</h1>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm">
          {users.length} Users
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-800 w-full outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-800"
        >
          <option value="all">All</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 shadow-lg">

        <div className="grid grid-cols-4 font-semibold border-b border-slate-700 pb-2 mb-2">
          <span>Email</span>
          <span>Role</span>
          <span>Update</span>
          <span>Action</span>
        </div>

        {loading && <p>Loading users...</p>}

        {filteredUsers.map((u) => (
          <div
            key={u._id}
            className="grid grid-cols-4 items-center py-3 border-b border-slate-700"
          >
            <span className="text-slate-300">{u.email}</span>

            <span>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  u.role === "admin"
                    ? "bg-red-500"
                    : u.role === "teacher"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {u.role}
              </span>
            </span>

            <select
              value={u.role}
              onChange={(e) => changeRole(u.email, e.target.value)}
              className="bg-slate-900 px-2 py-1 rounded"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={() => deleteUser(u.email)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-6 text-slate-400">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}