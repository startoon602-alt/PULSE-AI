import { db } from '../src/lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';

export async function deductCredits(userId: string, amount: number, description: string, relatedId?: string) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) throw new Error("User not found");
  
  const currentCredits = userDoc.data().credits;
  if (currentCredits < amount) throw new Error("Insufficient credits");

  // Deduct credits
  await updateDoc(userRef, {
    credits: increment(-amount),
    updatedAt: serverTimestamp()
  });

  // Log transaction
  await addDoc(collection(db, 'transactions'), {
    userId,
    amount: -amount,
    type: 'generation',
    description,
    relatedId,
    createdAt: serverTimestamp()
  });

  return true;
}

export async function refundCredits(userId: string, amount: number, description: string, relatedId?: string) {
  const userRef = doc(db, 'users', userId);
  
  // Add credits
  await updateDoc(userRef, {
    credits: increment(amount),
    updatedAt: serverTimestamp()
  });

  // Log transaction
  await addDoc(collection(db, 'transactions'), {
    userId,
    amount: amount,
    type: 'refund',
    description,
    relatedId,
    createdAt: serverTimestamp()
  });

  return true;
}
