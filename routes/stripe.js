import { Router } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router=Router();

router.post("/payment", (req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "inr",
        },
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                console.error(stripeErr); 
                return res.status(500).json({ error: stripeErr.message });
            }
            res.status(200).json(stripeRes);
        }
    );
});



export default router;