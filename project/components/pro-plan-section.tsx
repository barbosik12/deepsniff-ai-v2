"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Crown, 
  Check, 
  Zap, 
  Brain, 
  Code, 
  Clock,
  Copy,
  Upload,
  Mail,
  CheckCircle,
  Loader2,
  QrCode,
  Wallet,
  Shield
} from 'lucide-react';

interface ProPlanSectionProps {
  className?: string;
}

export function ProPlanSection({ className = '' }: ProPlanSectionProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);

  const walletAddress = '4Dk15XncninmBS7hjbBWVi8b5ouCV6X5pPJtvdRFXnvY';
  const price = '$15';
  const currency = 'SOL';

  // Generate QR code URL for Solana wallet
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=solana:${walletAddress}?amount=0.1&label=DeepSniff%20Pro%20Plan`;

  const features = [
    {
      icon: Zap,
      title: 'Unlimited image & video analysis',
      description: 'No daily limits on deepfake detection'
    },
    {
      icon: Brain,
      title: 'Full access to technical deepfake heatmaps & reports',
      description: 'Detailed Grad-CAM visualizations and analysis breakdowns'
    },
    {
      icon: Clock,
      title: 'Fast processing and priority detection',
      description: 'Skip the queue with priority processing'
    },
    {
      icon: Code,
      title: 'API Access',
      description: 'Integrate DeepSniff into your own applications'
    }
  ];

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setWalletCopied(true);
      setTimeout(() => setWalletCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy wallet address:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handlePaymentConfirmation = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowPaymentDialog(false);
    setShowConfirmationDialog(true);
  };

  return (
    <div className={className} data-pro-plan>
      <Card className="card-cosmic relative overflow-hidden group">
        {/* Premium glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Crown decoration */}
        <div className="absolute top-4 right-4 w-8 h-8 text-yellow-400/60 group-hover:text-yellow-400 transition-colors duration-300">
          <Crown className="w-full h-full" />
        </div>

        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 lunar-glow group-hover:scale-110 transition-transform duration-300">
            <Crown className="w-8 h-8 text-background" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-foreground mb-2 group-hover:text-yellow-400 transition-colors">
            Pro Plan
          </CardTitle>
          
          <CardDescription className="text-lg text-muted-foreground">
            Unlock unlimited deepfake detection & full reports
          </CardDescription>

          {/* Price */}
          <div className="mt-6">
            <div className="text-5xl font-bold text-foreground mb-2">
              {price}
              <span className="text-lg text-muted-foreground font-normal">/month</span>
            </div>
            <Badge className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400 font-medium">
              Crypto Only • Solana
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-3 group/feature">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mt-0.5 group-hover/feature:scale-110 transition-transform duration-200">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <IconComponent className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-foreground group-hover/feature:text-primary transition-colors">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Section */}
          <div className="pt-6 border-t border-border/30">
            <div className="bg-card/30 p-6 rounded-lg border border-yellow-500/20 relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
              
              <div className="relative z-10">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-yellow-400" />
                  💰 Payment Method
                </h4>
                
                {/* QR Code and Wallet */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-3 bg-white p-2 rounded-lg shadow-lg">
                      <img
                        src={qrCodeUrl}
                        alt="Solana Wallet QR Code"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback if QR service fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-muted flex items-center justify-center rounded">
                                <div class="text-center">
                                  <div class="w-8 h-8 mx-auto mb-2 text-primary">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m6-4h.01M12 8h.01"></path>
                                    </svg>
                                  </div>
                                  <p class="text-xs text-muted-foreground">QR Code</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Scan with Solana wallet</p>
                  </div>
                  
                  {/* Wallet Address */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Solana Wallet Address:
                    </Label>
                    <div className="bg-muted/50 p-3 rounded border border-border/50 mb-3">
                      <div className="flex items-center justify-between">
                        <code className="text-xs text-foreground font-mono break-all">
                          {walletAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyWalletAddress}
                          className="ml-2 hover:bg-primary/10"
                        >
                          {walletCopied ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Send approximately <strong>0.1 SOL</strong> (≈ {price}) to this address
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activation Button */}
          <Button
            onClick={() => setShowPaymentDialog(true)}
            className="w-full btn-cosmic-primary font-semibold py-6 text-lg group/btn"
          >
            <Shield className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" />
            I&apos;ve Sent Payment – Activate Pro
          </Button>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secure crypto payments • No personal data required
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="card-cosmic border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Confirm Payment
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Help us verify your payment to activate Pro Plan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                Email Address (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-cosmic"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We&apos;ll notify you when Pro Plan is activated
              </p>
            </div>

            {/* Screenshot Upload */}
            <div>
              <Label htmlFor="screenshot" className="text-sm font-medium text-foreground mb-2 block">
                Payment Screenshot (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="input-cosmic file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary/90"
                />
                {screenshot && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{screenshot.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a screenshot of your transaction for faster verification
              </p>
            </div>

            {/* Payment Info Reminder */}
            <div className="bg-card/30 p-4 rounded-lg border border-border/30">
              <h4 className="font-medium text-foreground mb-2">Payment Details:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Amount:</strong> ~0.1 SOL (≈ {price})</p>
                <p><strong>Wallet:</strong> {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</p>
                <p><strong>Network:</strong> Solana Mainnet</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePaymentConfirmation}
                disabled={isSubmitting}
                className="flex-1 btn-cosmic-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="card-cosmic border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Payment Submitted!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Your Pro Plan activation request has been received
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Success Message */}
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Thank you!
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your request will be verified within a few minutes. We&apos;ll activate your Pro Plan as soon as the payment is confirmed on the blockchain.
              </p>
            </div>

            {/* What's Next */}
            <div className="bg-card/30 p-4 rounded-lg border border-border/30">
              <h4 className="font-medium text-foreground mb-3">What happens next:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Payment verification (1-5 minutes)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Pro Plan activation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Email confirmation (if provided)</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowConfirmationDialog(false)}
              className="w-full btn-cosmic-primary"
            >
              Got it, thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}