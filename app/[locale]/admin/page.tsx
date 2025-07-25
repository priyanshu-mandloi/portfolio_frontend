"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Navbarblogs from "@/components/Navbarblogs";
import apiRequest from "@/lib/apiRequest";
import { toast } from "react-hot-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await apiRequest.get("/messages");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await apiRequest.delete(`/messages/${id}`);
      toast.success("Message deleted");
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <Navbarblogs />
      <div className="pt-24 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Panel - Messages
        </h1>
        {loading ? (
          <p className="text-center">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages found.</p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-neutral-900 shadow-lg rounded-xl p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Message</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} className="border-b">
                    <td className="py-2 px-4">{msg.name}</td>
                    <td className="py-2 px-4">{msg.email}</td>
                    <td className="py-2 px-4">{msg.message}</td>
                    <td className="py-2 px-4">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(msg.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
