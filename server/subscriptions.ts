import express from "express";
import { db } from "../src/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";

const router = express.Router();

router.post("/upgrade", async (req, res) => {
  const { userId, planId, billingCycle } = req.body;
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return res.status(404).json({ error: "User not found" });

    // In production, this would verify a payment session with Stripe/Razorpay
    // For now, we simulate a successful upgrade
    
    await updateDoc(userRef, {
      plan: planId,
      billingCycle,
      planStatus: 'active',
      updatedAt: serverTimestamp()
    });

    // Log transaction
    await addDoc(collection(db, 'transactions'), {
      userId,
      amount: 0, // Subscription payment
      type: 'subscription',
      description: `Upgrade to ${planId.toUpperCase()} (${billingCycle})`,
      createdAt: serverTimestamp()
    });

    res.json({ success: true, plan: planId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
