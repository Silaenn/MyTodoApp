import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const Profile = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-form p-6 rounded-lg shadow-md w-9/12">
        {/* Profile Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-form rounded-full flex items-center justify-center">
            <span className="text-2xl">U</span>
          </div>
          <div>
            <Input
              type="text"
              defaultValue="YourUsername"
              className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Username"
            />
            <p className="text-gray-400 text-sm mt-1">user@example.com</p>
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-6">
          <Label className="block text-sm font-medium mb-2">
            Change Password
          </Label>
          <Input
            type="password"
            placeholder="Current Password"
            className="text-base focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
          />
          <Input
            type="password"
            placeholder="New Password"
            className="text-base focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            className="text-base focus-visible:ring-0 focus-visible:ring-offset-0 mb-2"
          />
          <Button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save Password
          </Button>
        </div>

        {/* Logout */}
        <Button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
