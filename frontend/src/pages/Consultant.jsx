import { motion } from 'framer-motion';
import { Mail, Phone, GraduationCap, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { fadeUp, stagger } from '../components/ui/motion';

const consultant = {
  name: 'Adii Jain',
  image: '/gallery/Consultant.jpeg',
  title: 'Store Consultant',
  phone: '+91-9876543210',
  email: 'adiijain.petcare@gmail.com',
  education: 'B.Tech CSE, Lovely Professional University',
};

const helpsWith = [
  'Choosing the right pet for your home and schedule',
  'Picking food, bedding and starter supplies',
  'Understanding grooming packages and pricing',
  'First-month care planning for a new pet',
];

const Consultant = () => (
  <div className="min-h-screen pb-24">
    <PageHeader
      eyebrow="Consultation"
      title="Free consultation"
      subtitle="A 15 to 20 minute call with Adii Jain about what would suit your home. No charge."
      align="center"
    />

    <Container className="pt-10">
      <motion.div
        variants={stagger(0, 0.1)}
        initial="hidden"
        animate="show"
        className="grid lg:grid-cols-[0.85fr_1fr] gap-10 lg:gap-16 items-start max-w-5xl mx-auto"
      >
        {/* Portrait card */}
        <motion.div variants={fadeUp}>
          <div className="rounded-2xl overflow-hidden bg-cream border border-hairline shadow-soft">
            <div className="aspect-[4/5] overflow-hidden bg-mist">
              <img
                src={consultant.image}
                alt={consultant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-7">
              <h2 className="text-xl font-semibold text-ink">
                {consultant.name}
              </h2>
              <p className="text-blush-500 font-medium text-sm mt-1">{consultant.title}</p>

              <div className="mt-6 pt-6 border-t border-hairline space-y-3.5">
                <Detail icon={GraduationCap}>{consultant.education}</Detail>
                <a
                  href={`tel:${consultant.phone}`}
                  className="flex items-start gap-3 text-sm text-ink-soft hover:text-blush-500 transition-colors"
                >
                  <Phone size={15} className="mt-0.5 shrink-0" strokeWidth={1.9} />
                  {consultant.phone}
                </a>
                <a
                  href={`mailto:${consultant.email}`}
                  className="flex items-start gap-3 text-sm text-ink-soft hover:text-blush-500 transition-colors break-all"
                >
                  <Mail size={15} className="mt-0.5 shrink-0" strokeWidth={1.9} />
                  {consultant.email}
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <div>
          <motion.div variants={fadeUp} className="rounded-2xl bg-shell p-8 mb-8">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-blush-100 text-blush-600 mb-6">
              <MessageCircle size={21} strokeWidth={1.9} />
            </span>
            <h3 className="text-lg font-semibold text-ink mb-3">
              What a consultation covers
            </h3>
            <ul className="space-y-3 mt-5">
              {helpsWith.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
                  <CheckCircle2 size={16} className="text-blush-400 shrink-0 mt-0.5" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-start gap-3 px-2 mb-8">
            <Clock size={16} className="text-ink-mute mt-0.5 shrink-0" strokeWidth={1.9} />
            <p className="text-sm text-ink-soft leading-relaxed">
              Available Monday to Saturday, 10am–7pm IST. Calls usually run
              15–20 minutes and there is no charge.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button href={`tel:${consultant.phone}`} size="lg">
              <Phone size={16} strokeWidth={2.2} />
              Call now
            </Button>
            <Button href={`mailto:${consultant.email}`} variant="outline" size="lg">
              <Mail size={16} strokeWidth={2.2} />
              Send an email
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Container>
  </div>
);

const Detail = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 text-sm text-ink-soft">
    <Icon size={15} className="mt-0.5 shrink-0" strokeWidth={1.9} />
    {children}
  </div>
);

export default Consultant;
