import React, { useState, useRef } from 'react';
import { DropOffNode, ItemCondition, ListingCategory, ListingItem, ListingType } from '../types';
import { useAuth } from '../context/AuthContext';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: ListingItem) => void;
  onRequireAuth: () => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Calculus Book',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMUC9meLxywuV6dOLGYS3oxNl3joZU-SliGzb9sCaWIbjrasSXND0E5cCT9sFH1cnJ1tm62HYMRALCwC0CAesA_jV-Wj-83j9-he0BCWlCIH2g2yyj5nnF6qPkBEJzzqo_XNgUtOfD8MfV19GMuU8ih7ZbSv-uJLuaVbhQB2FbIXcvIZQuqHi0Q29OYon6z8yIvgAkfhhmi5AdCnZSfnSZe83rmIn10LupdGEhbV23cQfy_Lpb97_t',
  },
  {
    name: 'Lab Coat',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVBQBeaGj8WNMteyTeHpktUcRnjhzo2JIl6CMxkMg447JcJVzgPs6udaKu75U7T9tbHMSWf5XtjnxK2dsw41YzolMHEy_mjg4mOulZJ3hD_Iy0JAUKEOHeNZ2MUJumvobxKo4x21joJ2p2EhqTLpacaS8uepyedkhvr4Yyvd_RxlnSpGvK8VQy0wF-R48beu0Wi3G98klquPxdLEQ6h23f7-vh0du1k4pqXxkdhUN_8aM5rCcomfyb',
  },
  {
    name: 'TI-84 Calc',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlcxViLR-w0iMzJSs7pq1IexFfUKTLL8kREuYUWUa9E3J5NGpc4-rpCb_2QwcGGFEKJ61WD22Mid1SHo7A7GfuXsS1eXjp0e85F5Di3am5_riH-TL1PHjyPnMm_dEGSlntumdwE-__GYYKchaXqI8HKeuPviGwXnAI80wwG05_wHPS7Fs0x5yPrWLfwn9rjY_tXay6NzYxVW-XyFLHQZjht_qpeiU8RqEC2EVYJx3-_1xdtDoO-cp1',
  },
  {
    name: 'Desk Lamp',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeFJmEEEvndtQT-RaKkRbvCOxubPrrPJzV1tXYK5ZCb-CPRHr392ZIZYxvh9RdPW04FoK6Sh9thNJj1LYNAp3uMFyTixBIlZHvZaKaa0nvRgjhALIkt3x3lsCG14muGge2C-4Em4iR4iRoOk5hti8tkKNw0MOKYLXpg-De11GRPFfAG5WNct5ZXCNNtpkiHe7wtDq8wNuww0I2zwD5MQxLU3xcZ3pHcbNWGVCFsudRmwmS2kY3RSFA',
  },
  {
    name: 'Robotics Kit',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9nmIiWWDsiiTy6hsK0yY_jG5EZ3eTY-nHXRuRIuP4yXcyvgZN5pwU4ESQwRknjLXb39VQFNjCJUjQQ7aliODPyYUVD_YeJSLwm8mYKMaMiI8RSBmY0PSEvq5tXsGwbuxtrqdn9LFrn6JBkm7a6uujtQTfQA4riELcMxS34CVhWClzN_JnYDvrzQzH7kassg9JhrAhgnQid2LgvtExNq_vd7LF6iMnk9SahrgAS4I62mNgvZrA43Jd',
  },
  {
    name: 'Algorithms CLRS',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO6m0Y9nkq9uew15SZMqj8hxbqntG2uRrYr1xuDvs1ScrEAJP4W_7SrJ2JZb0Az0am5Q03ONqFuJG7s0Ux1rEJ__gB_TU6AfXt1CLraybR4p6QIAArD4YBGW7QG5pnb046-yy2qulibkY0G_c0rBnJaR-Gh5Xmhnsf2G6q-xEnOEPKd6oCURv-3s37_ooLWE-09bGFrG5Yfk5uukwAcW5jKr3OHn_N6fsyTHfYdb6fGFId7AmBtpGt',
  },
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  onRequireAuth,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Books & Notes');
  const [type, setType] = useState<ListingType>('Donation');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [location, setLocation] = useState<DropOffNode>('Library North Atrium');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [uploadedPhotoPreview, setUploadedPhotoPreview] = useState<string | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [courseTag, setCourseTag] = useState('');
  const [exchangeWish, setExchangeWish] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fadeIn">
        <div onClick={onClose} className="fixed inset-0" aria-hidden="true" />
        <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 text-center space-y-4 shadow-xl border border-outline-variant/30 z-10">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">lock</span>
          </div>
          <h3 className="font-title-md text-title-md text-primary font-semibold">
            Authentication Required
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            To prevent fraud and maintain campus safety, only authenticated university students may list goods.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-surface-container font-label-md text-label-md text-on-surface cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image file size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPhotoPreview(reader.result as string);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a descriptive title for your item.');
      return;
    }

    const finalImage = uploadedPhotoPreview || customPhotoUrl.trim() || selectedPhoto;

    const userInitials = currentUser.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newItem: ListingItem = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'No additional description provided.',
      category,
      type,
      condition,
      location,
      imageUrl: finalImage,
      userId: currentUser.id,
      userName: currentUser.name,
      userDept: `${currentUser.department.split('&')[0].trim()} '${currentUser.classYear.replace(/[^0-9]/g, '')}`,
      userInitials,
      userAvatarBg: 'bg-primary-container text-on-primary',
      userEmail: currentUser.email,
      listedTime: 'Just now',
      courseTag: courseTag.trim() || undefined,
      exchangeWish: type === 'Exchange' ? exchangeWish.trim() : undefined,
      status: 'available',
      bookmarked: false,
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
      <div onClick={onClose} className="fixed inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden z-10 border border-outline-variant/30 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md text-primary font-semibold">Post Campus Item</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Listing as <strong>{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-error-container text-on-error-container text-label-md rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Listing Type Toggle */}
          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1.5">
              Exchange Protocol
            </label>
            <div className="grid grid-cols-2 gap-2 bg-surface-container p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setType('Donation')}
                className={`py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'Donation'
                    ? 'bg-secondary-container text-on-secondary-fixed shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                <span>Free Donation (Mutual Aid)</span>
              </button>
              <button
                type="button"
                onClick={() => setType('Exchange')}
                className={`py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'Exchange'
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                <span>Campus Exchange / Trade</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
              Item Title *
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry Molecular Model Kit 2nd Ed"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ListingCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
              >
                <option value="Books & Notes">Books & Notes</option>
                <option value="Electronics & STEM">Electronics & STEM</option>
                <option value="Lab Gear & Coats">Lab Gear & Coats</option>
                <option value="Calculators & Kits">Calculators & Kits</option>
                <option value="Dorm Living">Dorm Living</option>
                <option value="Stationery">Stationery</option>
                <option value="Sports">Sports</option>
                <option value="Hostel">Hostel</option>
                <option value="Apparel">Apparel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
              >
                <option value="Like New">Like New (Mint)</option>
                <option value="Good">Good (Minor wear)</option>
                <option value="Fair / Readable">Fair / Readable</option>
              </select>
            </div>
          </div>

          {/* Location Safe-Swap Drop-off Node */}
          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
              Drop-off Campus Node
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as DropOffNode)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
            >
              <option value="Library North Atrium">Library North Atrium (24/7 Monitored)</option>
              <option value="Engineering Block C">Engineering Block C (Opposite Lab 102)</option>
              <option value="Student Union Hub">Student Union Hub (Lounge area)</option>
              <option value="East Dorm Quad Hub">East Dorm Quad Hub (Residential)</option>
              <option value="Chemistry Annex">Chemistry Annex</option>
              <option value="South Dormitory">South Dormitory</option>
            </select>
          </div>

          {/* Realistic Photo Selector: Upload or Presets */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Item Photo (Upload or Choose Preset)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">upload_file</span>
                <span>Upload From Device</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {uploadedPhotoPreview ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-primary mb-2">
                <img
                  src={uploadedPhotoPreview}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setUploadedPhotoPreview(null)}
                  className="absolute top-2 right-2 bg-surface text-primary p-1 rounded-full shadow text-label-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
                <span className="absolute bottom-2 left-2 bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded">
                  Device Photo Loaded
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-2 mb-2">
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setSelectedPhoto(p.url);
                      setUploadedPhotoPreview(null);
                      setCustomPhotoUrl('');
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedPhoto === p.url && !uploadedPhotoPreview && !customPhotoUrl
                        ? 'border-primary ring-2 ring-primary-container'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <input
              value={customPhotoUrl}
              onChange={(e) => {
                setCustomPhotoUrl(e.target.value);
                setUploadedPhotoPreview(null);
              }}
              placeholder="Or enter image URL..."
              className="w-full px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-label-md focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Course Tag & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Course Requisite (Optional)
              </label>
              <input
                value={courseTag}
                onChange={(e) => setCourseTag(e.target.value)}
                placeholder="e.g. CHEM 102, MATH 201"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            {type === 'Exchange' && (
              <div>
                <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                  Exchange Wishlist
                </label>
                <input
                  value={exchangeWish}
                  onChange={(e) => setExchangeWish(e.target.value)}
                  placeholder="e.g. TI-84 cable or biology notes"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
              Description &amp; Condition Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight any markings, included components, or best handover time..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-surface-container">
            <button
              type="submit"
              className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">publish</span>
              <span>Publish Listing to Campus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
