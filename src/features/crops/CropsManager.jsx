import { useState, useEffect } from "react";
import cropsService from "../../service/api/cropsService";

export default function CropsManager() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    category: "VEGETABLES",
    standard_unit: "KG"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await cropsService.getAll();
      if (res.success) {
        setCrops(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch crops");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      const res = await cropsService.delete(id);
      if (res.success) {
        setCrops(crops.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete crop");
      }
    } catch (err) {
      alert("Error deleting crop");
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ name_ar: "", name_en: "", category: "VEGETABLES", standard_unit: "KG" });
    setIsFormOpen(true);
  };

  const openEditForm = (crop) => {
    setEditingId(crop.id);
    setFormData({
      name_ar: crop.name_ar || "",
      name_en: crop.name_en || "",
      category: crop.category || "VEGETABLES",
      standard_unit: crop.standard_unit || "KG",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await cropsService.update(editingId, formData);
        if (res.success) {
          const updated = res.data;
          setCrops(crops.map(c => c.id === editingId ? updated : c));
          setIsFormOpen(false);
        } else {
          alert(res.message || "Update failed");
        }
      } else {
        const res = await cropsService.create(formData);
        if (res.success) {
          setCrops([res.data, ...crops]);
          setIsFormOpen(false);
        } else {
          alert(res.message || "Creation failed");
        }
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>Crops Management</h1>
        <button onClick={openAddForm} style={{ padding: "10px 20px", background: "#2E7D32", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 4px rgba(46,125,50,0.2)" }}>
          + Add New Crop
        </button>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 16, borderRadius: 8, marginBottom: 24, border: "1px solid #f87171" }}>
          {error}
        </div>
      )}

      {isFormOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
          <div style={{ background: "#fff", padding: 32, borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{editingId ? "Edit Crop" : "Add New Crop"}</h2>
              <button onClick={() => setIsFormOpen(false)} style={{ background: "none", border: "none", fontSize: 24, color: "#9ca3af", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Name (Arabic) *</label>
                  <input required value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Name (English) *</label>
                  <input required value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Category *</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={inputStyle}>
                  <option value="VEGETABLES">Vegetables (خضروات)</option>
                  <option value="FRUITS">Fruits (فواكه)</option>
                  <option value="GRAINS">Grains (حبوب)</option>
                  <option value="OTHER">Other (أخرى)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Standard Unit *</label>
                <select value={formData.standard_unit} onChange={e => setFormData({ ...formData, standard_unit: e.target.value })} style={inputStyle}>
                  <option value="KG">KG (كيلوجرام)</option>
                  <option value="TON">TON (طن)</option>
                  <option value="BOX">BOX (صندوق)</option>
                  <option value="PIECE">PIECE (قطعة)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ flex: 1, padding: 12, border: "1px solid #d1d5db", background: "#fff", borderRadius: 8, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: 12, border: "none", background: "#2E7D32", color: "#fff", borderRadius: 8, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Saving..." : "Save Crop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)", overflow: "auto" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#64748b" }}>Loading crops...</div>
        ) : crops.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#64748b" }}>No crops found. Click "Add New Crop" to begin.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "12px 24px", color: "#475569", fontWeight: 600, fontSize: 13, textTransform: "uppercase" }}>Crop</th>
                <th style={{ padding: "12px 24px", color: "#475569", fontWeight: 600, fontSize: 13, textTransform: "uppercase" }}>Category</th>
                <th style={{ padding: "12px 24px", color: "#475569", fontWeight: 600, fontSize: 13, textTransform: "uppercase" }}>Unit</th>
                <th style={{ padding: "12px 24px", color: "#475569", fontWeight: 600, fontSize: 13, textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ divideY: "1px solid #e2e8f0" }}>
              {crops.map((crop) => (
                <tr key={crop.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{crop.name_ar}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{crop.name_en}</div>
                  </td>
                  <td style={{ padding: "16px 24px", color: "#475569" }}>
                    <span style={{ padding: "4px 8px", background: "#f1f5f9", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#334155" }}>
                      {crop.category}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", color: "#475569", fontWeight: 500 }}>{crop.standard_unit}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        onClick={() => openEditForm(crop)}
                        style={{ padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: 6, color: "#0284c7", background: "#f0f9ff", cursor: "pointer", fontWeight: 500 }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(crop.id)}
                        style={{ padding: "6px 12px", border: "1px solid #fecaca", borderRadius: 6, color: "#ef4444", background: "#fef2f2", cursor: "pointer", fontWeight: 500 }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
