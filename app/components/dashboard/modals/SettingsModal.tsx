import React from 'react';
import { X, Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Profile Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Emillia Caitin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="hey@agency.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Get notified in your browser</p>
                </div>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">Light Mode</Button>
              <Button variant="outline">Dark Mode</Button>
              <Button variant="outline">Auto</Button>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Privacy & Security</h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}