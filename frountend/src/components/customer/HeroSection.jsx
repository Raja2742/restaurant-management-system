import { ArrowRight, Leaf, Clock, Award } from "lucide-react";
import "./HeroSection.css";

export default function HeroSection() {
    return (
        <section className="customer-hero">

            {/* Hero Content */}
            <div className="hero-content">

                <span className="hero-label">
                    <span className="hero-label-dot"></span>
                    WELCOME TO URBAN TABLE
                </span>

                <h1>
                    Good food.
                    <br />
                    <span>Great moments.</span>
                </h1>

                <p>
                    Discover delicious flavours made with fresh
                    ingredients and served with love. Your next
                    favourite meal is just a click away.
                </p>

                <a href="#menu" className="hero-button">
                    Explore our menu
                    <ArrowRight size={18} />
                </a>

                {/* Highlights */}
                <div className="hero-highlights">

                    <div className="hero-highlight-item">
                        <Leaf size={19} />
                        <span>Fresh ingredients</span>
                    </div>

                    <div className="hero-highlight-item">
                        <Clock size={19} />
                        <span>Quick service</span>
                    </div>

                    <div className="hero-highlight-item">
                        <Award size={19} />
                        <span>Quality food</span>
                    </div>

                </div>
            </div>

            {/* Hero Decoration */}
            <div className="hero-decoration">
                <div className="hero-image-circle">
                    <span>MADE FRESH</span>
                    <strong>EVERY DAY</strong>
                </div>
            </div>

        </section>
    );
}