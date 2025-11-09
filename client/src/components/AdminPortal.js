import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import config from "./config";
import Spinner from "./Spinner";
import "./AdminPortal.css";

const Base_URL = config.baseURL;

const AdminPortal = () => {
  const [items, setItems] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, lost, found
  const [activeTab, setActiveTab] = useState("items"); // items, helpers

  useEffect(() => {
    fetchItems();
    fetchHelpers();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${Base_URL}/item`);
      setItems(res.data.gotItem);
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Error fetching items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHelpers = async () => {
    try {
      const res = await axios.get(`${Base_URL}/helper`);
      setHelpers(res.data.gotHelper);
    } catch (error) {
      console.error("Error fetching helpers:", error);
    }
  };

  const sendWhatsAppMessage = (phonenumber, itemname, concerntype) => {
    // Remove any spaces or special characters from phone number
    const cleanPhone = phonenumber.replace(/[^0-9+]/g, "");
    
    // Create message based on concern type
    let message = "";
    if (concerntype === "lost") {
      message = `Hello! Good news! We may have found your lost item: "${itemname}". Please contact the Lost & Found office for verification and collection. Thank you!`;
    } else {
      message = `Hello! Thank you for reporting the found item: "${itemname}". The owner has been notified. Please bring the item to the Lost & Found office. Thank you for your help!`;
    }
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");
  };

  const handleApprove = async (itemId) => {
    if (window.confirm("Are you sure you want to approve this item claim?")) {
      try {
        await axios.delete(`${Base_URL}/item/${itemId}`);
        alert("Item approved and removed from the list!");
        fetchItems(); // Refresh the list
      } catch (error) {
        console.error("Error approving item:", error);
        alert("Error approving item. Please try again.");
      }
    }
  };

  const handleReject = async (itemId) => {
    if (window.confirm("Are you sure you want to reject this item claim?")) {
      alert("Item claim rejected. The item will remain in the system.");
      // Optionally, you can add logic to mark the item as rejected
    }
  };

  const handleApproveHelper = async (helperId) => {
    if (window.confirm("Are you sure you want to approve this helper request?")) {
      try {
        await axios.delete(`${Base_URL}/helper/${helperId}`);
        alert("Helper request approved and removed from the list!");
        fetchHelpers(); // Refresh the list
      } catch (error) {
        console.error("Error approving helper:", error);
        alert("Error approving helper. Please try again.");
      }
    }
  };

  const handleRejectHelper = async (helperId) => {
    if (window.confirm("Are you sure you want to reject this helper request?")) {
      try {
        await axios.delete(`${Base_URL}/helper/${helperId}`);
        alert("Helper request rejected and removed!");
        fetchHelpers(); // Refresh the list
      } catch (error) {
        console.error("Error rejecting helper:", error);
        alert("Error rejecting helper. Please try again.");
      }
    }
  };

  const sendWhatsAppToHelper = (phonenumber, helpername, itemdetails) => {
    const cleanPhone = phonenumber.replace(/[^0-9+]/g, "");
    const message = `Hello ${helpername}! Thank you for helping with: "${itemdetails}". We appreciate your assistance. Please contact the Lost & Found office for further details. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.concerntype === filter;
  });

  return (
    <>
      <Navbar />
      <div className="admin-portal">
        <h1>Admin Portal - Lost & Found Management</h1>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "items" ? "active" : ""}`}
            onClick={() => setActiveTab("items")}
          >
            📦 Items ({items.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "helpers" ? "active" : ""}`}
            onClick={() => setActiveTab("helpers")}
          >
            🤝 Helper Requests ({helpers.length})
          </button>
        </div>

        {/* Items Tab */}
        {activeTab === "items" && (
          <>
            <div className="filter-section">
          <label>Filter by Type: </label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Items</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>
          <span className="item-count">
            Showing {filteredItems.length} of {items.length} items
          </span>
        </div>

        {isLoading ? (
          <Spinner />
        ) : filteredItems.length === 0 ? (
          <p className="no-items">No items found.</p>
        ) : (
          <div className="items-grid">
            {filteredItems.map((item) => (
              <div key={item._id} className={`item-card ${item.concerntype}`}>
                <div className="item-header">
                  <h3>{item.itemname}</h3>
                  <span className={`badge ${item.concerntype}`}>
                    {item.concerntype.toUpperCase()}
                  </span>
                </div>
                
                <p className="item-description">{item.itemdescription}</p>
                
                <div className="item-details">
                  <p>
                    <strong>Phone:</strong> {item.phonenumber}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>

                {item.images && item.images.length > 0 && (
                  <div className="item-images">
                    {item.images.slice(0, 2).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${item.itemname} ${index + 1}`}
                        className="item-image"
                      />
                    ))}
                    {item.images.length > 2 && (
                      <span className="more-images">
                        +{item.images.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                <div className="action-buttons">
                  <button
                    className="whatsapp-btn"
                    onClick={() =>
                      sendWhatsAppMessage(
                        item.phonenumber,
                        item.itemname,
                        item.concerntype
                      )
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                      style={{ marginRight: "8px" }}
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp
                  </button>
                  
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(item._id)}
                  >
                    ✓ Approve
                  </button>
                  
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(item._id)}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Helpers Tab */}
        {activeTab === "helpers" && (
          <>
            {isLoading ? (
              <Spinner />
            ) : helpers.length === 0 ? (
              <p className="no-items">No helper requests found.</p>
            ) : (
              <div className="items-grid">
                {helpers.map((helper) => (
                  <div key={helper._id} className="item-card helper-card">
                    <div className="item-header">
                      <h3>🤝 Helper Request</h3>
                      <span className="badge helper-badge">PENDING</span>
                    </div>
                    
                    <div className="item-details">
                      <p>
                        <strong>Helper Name:</strong> {helper.helpername}
                      </p>
                      <p>
                        <strong>Phone:</strong> {helper.mobilenumber}
                      </p>
                      <p>
                        <strong>Hostel:</strong> {helper.hostelname}
                      </p>
                      <p>
                        <strong>Item Details:</strong> {helper.itemdetails}
                      </p>
                      <p>
                        <strong>Date:</strong> {new Date(helper.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="whatsapp-btn"
                        onClick={() =>
                          sendWhatsAppToHelper(
                            helper.mobilenumber,
                            helper.helpername,
                            helper.itemdetails
                          )
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="white"
                          style={{ marginRight: "8px" }}
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </button>
                      
                      <button
                        className="approve-btn"
                        onClick={() => handleApproveHelper(helper._id)}
                      >
                        ✓ Approve
                      </button>
                      
                      <button
                        className="reject-btn"
                        onClick={() => handleRejectHelper(helper._id)}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminPortal;
