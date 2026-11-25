import { Utensils, Heart } from "lucide-react";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="customer-footer">

            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-brand-icon">
                        <Utensils size={20} />
                    </span>

                    <span>Urban Table</span>
                </div>

                <p className="footer-tagline">
                    Good food, shared moments.
                </p>
            </div>

            <div className="footer-bottom">
                <span>
                    © {new Date().getFullYear()} Urban Table. All rights reserved.
                </span>

                <span className="footer-made-with">
                    Made with <Heart size={14} /> for food lovers
                </span>
            </div>

        </footer>
    );
}