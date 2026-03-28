// FILE: src/app/admin/prenatal-seats/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/200hr-seatsbatch.module.css";

interface SeatRow {
  _id: string;
  startDate: string;
  endDate: string;
  usdFee: string;
  inrFee: string;
  dormPrice: string;
  twinPrice: string;
  privatePrice: string;
  totalSeats: number;
  bookedSeats: number;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function PrenatalSeatsListPage() {
  const [rows, setRows] = useState<SeatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRows = async () => {
    try {
      const res = await api.get("/prenatal-seats");
      setRows(res.data.data ?? []);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRows(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/prenatal-seats/${deleteId}`);
      toast.success("Deleted successfully");
      setDeleteId(null);
      fetchRows();
    } catch {
      toast.error("Delete failed");
    }
  };

  const isFull = (row: SeatRow) => row.bookedSeats >= row.totalSeats;
  const remaining = (row: SeatRow) => row.totalSeats - row.bookedSeats;

  if (loading) return <div className={styles.page}>Loading…</div>;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Prenatal Yoga — Seats & Dates</h1>
          <p className={styles.pageSubtitle}>
            Manage upcoming prenatal batch dates, fees and seat availability
          </p>
        </div>
        <Link
          href="/admin/yogacourse/prenatal-yoga-course/prenatal-seats/add-new"
          className={styles.addBtn}
        >
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Batch</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {rows.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No batches found. Add your first batch.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Batch Dates</th>
                <th>Fee (USD)</th>
                <th>Fee (INR)</th>
                <th>Room Prices</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row._id} className={styles.row}>
                  <td className={styles.tdCenter}>{i + 1}</td>
                  <td className={styles.dateCell}>
                    {formatDate(row.startDate)} – {formatDate(row.endDate)}
                  </td>
                  <td className={styles.tdCenter}>{row.usdFee}</td>
                  <td className={styles.tdCenter}>{row.inrFee}</td>
                  <td>
                    <div className={styles.roomChips}>
                      <span className={styles.roomChip}>Dorm: <strong>${row.dormPrice}</strong></span>
                      <span className={styles.roomChip}>Twin: <strong>${row.twinPrice}</strong></span>
                      <span className={styles.roomChip}>Pvt: <strong>${row.privatePrice}</strong></span>
                    </div>
                  </td>
                  <td className={styles.tdCenter}>
                    <span className={styles.seatsNum}>
                      {isFull(row) ? "0" : remaining(row)} / {row.totalSeats}
                    </span>
                  </td>
                  <td className={styles.tdCenter}>
                    {isFull(row)
                      ? <span className={styles.badgeFull}>Fully Booked</span>
                      : <span className={styles.badgeOpen}>Open</span>
                    }
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <Link
                        href={`/admin/yogacourse/prenatal-yoga-course/prenatal-seats/${row._id}`}
                        className={styles.editBtn}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteId(row._id)}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this batch?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className={styles.modalConfirm} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}