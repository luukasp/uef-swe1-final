import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { signUpWithEmail, signInWithEmail } from "@/lib/api/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

type ChildForm = {
  firstName: string;
  lastName: string;
  dob: string;
};

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Account details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Children details
  const [children, setChildren] = useState<ChildForm[]>([
    { firstName: "", lastName: "", dob: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChildChange = (
    index: number,
    field: keyof ChildForm,
    value: string,
  ) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const addChild = () => {
    setChildren([...children, { firstName: "", lastName: "", dob: "" }]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  async function onFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Create user account
    const res = await signUpWithEmail({ name, email, password });
    if (res.error) {
      setError(res.error.message);
      setLoading(false);
      setStep(1); // Go back to account form
      return;
    }

    // 2. After successful signup, sign in to establish session (required by /v1/child endpoints)
    const signInRes = await signInWithEmail({ email, password });
    if (signInRes.error) {
      setError(
        "Account created but failed to sign in. Please log in manually.",
      );
      setLoading(false);
      return;
    }

    // Now, create the children and link them to this parent.
    try {
      for (const child of children) {
        if (child.firstName && child.lastName && child.dob) {
          const resp = await apiPost("/v1/child/", {
            firstName: child.firstName,
            lastName: child.lastName,
            dob: child.dob,
            // Gender and medical can be added later
          });
          // Optionally handle resp
        }
      }
    } catch (e: any) {
      console.error(e);
      setError("Failed to register children. Please contact support.");
      setLoading(false);
      return;
    }

    setLoading(false);
    // Redirect to parents dashboard after setup
    navigate({ to: "/parents" });
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* LEFT */}
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* LOGO */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            KinderConnect
          </a>
        </div>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="flex items-center justify-center gap-2 text-lg font-semibold">
                <UserPlus className="h-4 w-4" />
                {step === 1
                  ? "Create your Parent Account"
                  : "Add your Children"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === 1
                  ? "Start by creating your login details."
                  : "Add at least one child to complete your profile."}
              </p>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Full name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Next: Add Children
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={onFinalSubmit} className="space-y-6">
                <div className="max-h-60 space-y-4 overflow-auto pr-2">
                  {children.map((child, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold">
                          Child {index + 1}
                        </Label>
                        {children.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeChild(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            value={child.firstName}
                            onChange={(e) =>
                              handleChildChange(
                                index,
                                "firstName",
                                e.target.value,
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            value={child.lastName}
                            onChange={(e) =>
                              handleChildChange(
                                index,
                                "lastName",
                                e.target.value,
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={child.dob}
                          onChange={(e) =>
                            handleChildChange(index, "dob", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addChild}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add another child
                </Button>

                <div className="flex flex-col-reverse sm:flex-row sm:gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-full flex-1 mb-2 sm:mb-0"
                    disabled={loading}
                  >
                    {loading ? "Finishing setup..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350"
          alt="Kindergarten"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
