// FILE: src/app/admin/dashboard/online-seats/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "@/assets/style/Admin/yogacourse/100hourscourse/Seatsmodule.module.css";

interface SeatRow {
  _id: string;
  startDate: string;
  endDate: string;
  usd200: string;
  usd300: string;
  inr200: string;
  inr300: string;
  totalSeats: number;
  bookedSeats: number;
  note?: string;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function OnlineSeatsListPage() {
  const [rows, setRows] = useState<SeatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRows = async () => {
    try {
      const res = await api.get("/online-seats/get-all-batches");
      setRows(res.data.data ?? []);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/online-seats/delete-batch/${deleteId}`);
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
          <h1 className={styles.pageTitle}>Online Yoga — Seats & Dates</h1>
          <p className={styles.pageSubtitle}>
            Manage upcoming batch dates, fees and seat availability for 200 & 300 Hour Online courses
          </p>
        </div>
        <Link
          href="/admin/yogacourse/online-yogacourse-seatbooking/add-new"
          className={styles.addBtn}
        >
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>Add Batch</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {rows.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No batches found. Add your first batch.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Batch Dates</th>
                  <th>200 Hr (USD)</th>
                  <th>300 Hr (USD)</th>
                  <th>200 Hr (INR)</th>
                  <th>300 Hr (INR)</th>
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
                    <td className={styles.tdCenter}>${row.usd200}</td>
                    <td className={styles.tdCenter}>${row.usd300}</td>
                    <td className={styles.tdCenter}>₹{row.inr200}</td>
                    <td className={styles.tdCenter}>₹{row.inr300}</td>
                    <td className={styles.tdCenter}>
                      <span className={styles.seatsNum}>
                        {isFull(row) ? "0" : remaining(row)} / {row.totalSeats}
                      </span>
                    </td>
                    <td className={styles.tdCenter}>
                      {isFull(row) ? (
                        <span className={styles.badgeFull}>Fully Booked</span>
                      ) : (
                        <span className={styles.badgeOpen}>Open</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <Link
                          href={`/admin/yogacourse/online-yogacourse-seatbooking/${row._id}`}
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

          {/* Mobile Cards */}
          <div className={styles.mobileCards}>
            <div className={styles.cardStack}>
              {rows.map((row, i) => {
                const full = isFull(row);
                const rem = remaining(row);
                return (
                  <div key={row._id} className={styles.batchCard}>
                    <div className={styles.cardTop}>
                      <span className={styles.cardIndexBadge}>#{i + 1}</span>
                      <div className={styles.cardDateBlock}>
                        <span className={styles.cardDateMain}>
                          {formatDate(row.startDate)}
                        </span>
                        <span className={styles.cardDateEnd}>
                          to {formatDate(row.endDate)}
                        </span>
                      </div>
                      {full ? (
                        <span className={styles.badgeFull}>Fully Booked</span>
                      ) : (
                        <span className={styles.badgeOpen}>Open</span>
                      )}
                    </div>

                    <div className={styles.cardDivider} />

                    <div className={styles.cardGrid}>
                      <div className={styles.cardGridItem}>
                        <div className={styles.cardGridLabel}>200 Hr (USD)</div>
                        <div className={styles.cardGridValue}>${row.usd200}</div>
                      </div>
                      <div className={styles.cardGridItem}>
                        <div className={styles.cardGridLabel}>300 Hr (USD)</div>
                        <div className={styles.cardGridValue}>${row.usd300}</div>
                      </div>
                      <div className={styles.cardGridItem}>
                        <div className={styles.cardGridLabel}>200 Hr (INR)</div>
                        <div className={styles.cardGridValue}>₹{row.inr200}</div>
                      </div>
                      <div className={styles.cardGridItem}>
                        <div className={styles.cardGridLabel}>300 Hr (INR)</div>
                        <div className={styles.cardGridValue}>₹{row.inr300}</div>
                      </div>
                      <div className={styles.cardGridItem}>
                        <div className={styles.cardGridLabel}>Seats Left</div>
                        <div className={styles.cardGridValueMono}>
                          {full ? "0" : rem} / {row.totalSeats}
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <Link
                        href={`/admin/dashboard/online-seats/edit/${row._id}`}
                        className={styles.cardEditBtn}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        className={styles.cardDeleteBtn}
                        onClick={() => setDeleteId(row._id)}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this batch?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteId(null)}
              >
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