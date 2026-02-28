import { motion } from "framer-motion";
import { Shield, Search, AlertTriangle, Link2, Brain, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

const methods = [
  { icon: Search, title: "Keyword Detection", desc: "Scans for urgency words like 'immediately', 'account blocked', 'verify now' that scammers use to pressure victims." },
  { icon: AlertTriangle, title: "OTP & Credential Requests", desc: "Detects phrases asking you to share OTP, PIN, password, CVV, or card details — a hallmark of phishing." },
  { icon: Link2, title: "Suspicious URL Detection", desc: "Identifies shortened URLs (bit.ly, tinyurl), IP-based links, and domains with deceptive keywords." },
  { icon: Brain, title: "Emotional Manipulation", desc: "Recognizes fear-based and pressure language like 'legal action', 'your account will be closed', or fake prizes." },
  { icon: Users, title: "Impersonation Patterns", desc: "Flags messages pretending to be from banks, government agencies, tech support, or popular services." },
];

const examples = [
  { label: "High-Risk", color: "text-danger", msg: "URGENT: Your bank account has been compromised! Click here to verify now: http://192.168.1.1/verify. Share your OTP immediately to secure your account." },
  { label: "Suspicious", color: "text-warning", msg: "Congratulations! You have been selected as a lucky winner. Click http://bit.ly/claimprize to claim your reward before it expires." },
  { label: "Safe", color: "text-safe", msg: "Hi, just a reminder that our meeting is scheduled for tomorrow at 3 PM. Let me know if you need to reschedule." },
];

const HowItWorks = () => (
  <div className="min-h-screen gradient-hero">
    <Header />
    <main className="container mx-auto max-w-3xl px-4 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          How It <span className="text-primary">Works</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Our multi-layered analysis engine examines messages across five detection categories
        </p>
      </motion.div>

      {/* Methods */}
      <div className="grid gap-4 sm:grid-cols-2">
        {methods.map((m, i) => (
          <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card h-full">
              <CardContent className="p-5">
                <m.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 font-display text-base font-semibold text-foreground">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Examples */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-14">
        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Example Messages</h2>
        <div className="space-y-4">
          {examples.map((ex, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-5">
                <span className={`mb-2 inline-block text-xs font-bold uppercase tracking-wider ${ex.color}`}>{ex.label}</span>
                <p className="text-sm text-muted-foreground italic leading-relaxed">"{ex.msg}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </main>
  </div>
);

export default HowItWorks;
