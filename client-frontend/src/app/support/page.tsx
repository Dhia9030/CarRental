"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageCircle,
  HelpCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Car,
  CreditCard,
  UserCheck,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { createComplaint, getUserComplaints } from "@/lib/api";

interface Complaint {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt: string;
  responses?: {
    id: string;
    message: string;
    isAdmin: boolean;
    createdAt: string;
  }[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I book a car?",
    answer:
      "To book a car, browse our available vehicles, select your desired dates and location, then click 'Book Now'. You'll need to provide your details and payment information to complete the booking.",
    category: "booking",
  },
  {
    id: "2",
    question: "What documents do I need to rent a car?",
    answer:
      "You'll need a valid driver's license, credit card, and valid ID (passport or national ID). International customers may need an International Driving Permit.",
    category: "booking",
  },
  {
    id: "3",
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel your booking up to 24 hours before the pickup time for a full refund. Cancellations within 24 hours may incur a fee.",
    category: "booking",
  },
  {
    id: "4",
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards (Visa, MasterCard, American Express) and debit cards. Some locations may also accept cash deposits.",
    category: "payment",
  },
  {
    id: "5",
    question: "Is insurance included?",
    answer:
      "Basic insurance is included in all rentals. Additional coverage options are available at checkout for extra protection.",
    category: "insurance",
  },
  {
    id: "6",
    question: "What happens if I return the car late?",
    answer:
      "Late returns may incur additional daily charges. Please contact us if you need to extend your rental period.",
    category: "rental",
  },
  {
    id: "7",
    question: "Can I add additional drivers?",
    answer:
      "Yes, additional drivers can be added to your rental for a small daily fee. They must meet the same requirements as the primary driver.",
    category: "rental",
  },
  {
    id: "8",
    question: "What if the car breaks down?",
    answer:
      "If you experience any issues with the vehicle, contact our 24/7 roadside assistance immediately. We'll arrange repairs or a replacement vehicle.",
    category: "support",
  },
];

export default function SupportPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");
  const [isCreateComplaintOpen, setIsCreateComplaintOpen] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await getUserComplaints();
      setComplaints(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load support tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      faqCategory === "all" || faq.category === faqCategory;

    return matchesSearch && matchesCategory;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "secondary";
      case "In Progress":
        return "default";
      case "Resolved":
        return "outline";
      case "Closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Resolved":
      case "Closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <Dialog
          open={isCreateComplaintOpen}
          onOpenChange={setIsCreateComplaintOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll help you resolve it
              </DialogDescription>
            </DialogHeader>
            <CreateComplaintForm
              onSuccess={() => {
                setIsCreateComplaintOpen(false);
                loadComplaints();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 mb-3">24/7 Support Hotline</p>
            <p className="font-medium">+1 (555) 123-4567</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="text-sm text-gray-600 mb-3">Get help via email</p>
            <p className="font-medium">support@carrental.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">Chat with our team</p>
            <Button variant="outline" size="sm">
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <MessageCircle className="h-4 w-4 mr-2" />
            My Tickets ({complaints.length})
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Contact Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* FAQ Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={faqCategory} onValueChange={setFaqCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FAQ Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="text-center p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFaqCategory("booking")}>
              <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium">Booking</h3>
              <p className="text-sm text-gray-500">Reservations & Bookings</p>
            </Card>
            <Card
              className="text-center p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFaqCategory("payment")}>
              <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium">Payment</h3>
              <p className="text-sm text-gray-500">Billing & Payments</p>
            </Card>
            <Card
              className="text-center p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFaqCategory("rental")}>
              <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium">Rental</h3>
              <p className="text-sm text-gray-500">During Your Rental</p>
            </Card>
            <Card
              className="text-center p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFaqCategory("support")}>
              <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium">Support</h3>
              <p className="text-sm text-gray-500">Technical Support</p>
            </Card>
          </div>

          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No FAQs found matching your search.
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No support tickets
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any support tickets yet.
                </p>
                <Button onClick={() => setIsCreateComplaintOpen(true)}>
                  Create Your First Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Customer Support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-gray-600">
                          +1 (555) 123-4567
                        </p>
                        <p className="text-xs text-gray-500">24/7 Support</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">
                          support@carrental.com
                        </p>
                        <p className="text-xs text-gray-500">
                          Response within 24 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-600">
                          Available on our website
                        </p>
                        <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    Emergency Assistance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Roadside Assistance</p>
                        <p className="text-sm text-gray-600">
                          +1 (555) 911-HELP
                        </p>
                        <p className="text-xs text-gray-500">
                          24/7 Emergency Support
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Vehicle Issues</p>
                        <p className="text-sm text-gray-600">
                          +1 (555) CAR-HELP
                        </p>
                        <p className="text-xs text-gray-500">
                          Breakdowns & Accidents
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Customer Service</p>
                    <p className="text-sm text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-sm text-gray-600">
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                    <p className="text-sm text-gray-600">Sunday: Closed</p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Support</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                    <p className="text-sm text-gray-600">365 days a year</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ComplaintCardProps {
  complaint: Complaint;
}

function ComplaintCard({ complaint }: ComplaintCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{complaint.subject}</h3>
              <Badge
                variant={getStatusBadgeVariant(complaint.status)}
                className="flex items-center gap-1">
                {getStatusIcon(complaint.status)}
                {complaint.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Category: {complaint.category}
            </p>
            <p className="text-sm text-gray-500">
              Created:{" "}
              {format(new Date(complaint.createdAt), "MMM dd, yyyy 'at' HH:mm")}
            </p>
            {complaint.updatedAt !== complaint.createdAt && (
              <p className="text-sm text-gray-500">
                Updated:{" "}
                {format(
                  new Date(complaint.updatedAt),
                  "MMM dd, yyyy 'at' HH:mm"
                )}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className={`text-gray-700 ${isExpanded ? "" : "line-clamp-2"}`}>
            {complaint.description}
          </div>

          {complaint.description.length > 150 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto"
              onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}

          {complaint.responses && complaint.responses.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <h4 className="font-medium mb-2">
                Responses ({complaint.responses.length})
              </h4>
              <div className="space-y-2">
                {complaint.responses
                  .slice(0, isExpanded ? undefined : 2)
                  .map((response) => (
                    <div
                      key={response.id}
                      className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={response.isAdmin ? "default" : "outline"}>
                          {response.isAdmin ? "Support Team" : "You"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(response.createdAt),
                            "MMM dd, HH:mm"
                          )}
                        </span>
                      </div>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  ))}
                {complaint.responses.length > 2 && !isExpanded && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={() => setIsExpanded(true)}>
                    Show {complaint.responses.length - 2} more responses
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CreateComplaintFormProps {
  onSuccess: () => void;
}

function CreateComplaintForm({ onSuccess }: CreateComplaintFormProps) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.subject.trim() ||
      !formData.description.trim() ||
      !formData.priority
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createComplaint({
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
      });
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create support ticket"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}{" "}
      <div className="space-y-2">
        <label className="text-sm font-medium">Priority *</label>
        <Select
          value={formData.priority}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              priority: value as "low" | "medium" | "high",
            })
          }>
          <SelectTrigger>
            <SelectValue placeholder="Select priority level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Subject *</label>
        <Input
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          placeholder="Brief description of your issue"
          maxLength={100}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description *</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Please provide detailed information about your issue..."
          rows={6}
          maxLength={1000}
        />
        <p className="text-xs text-gray-500">
          {formData.description.length}/1000 characters
        </p>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </form>
  );
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Open":
      return "secondary";
    case "In Progress":
      return "default";
    case "Resolved":
      return "outline";
    case "Closed":
      return "destructive";
    default:
      return "secondary";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Open":
      return <AlertCircle className="h-4 w-4" />;
    case "In Progress":
      return <Clock className="h-4 w-4" />;
    case "Resolved":
    case "Closed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}
