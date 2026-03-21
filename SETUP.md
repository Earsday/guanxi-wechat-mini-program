# Setup Notes

## Missing Assets

The `app.json` file references tab bar icons that need to be created:
- `assets/icons/home.png` (40x40px)
- `assets/icons/home-active.png` (40x40px)
- `assets/icons/people.png` (40x40px)
- `assets/icons/people-active.png` (40x40px)

For now, you can:
1. Remove the `tabBar` section from `miniprogram/app.json` to run without icons, OR
2. Create simple placeholder icons in the `miniprogram/assets/icons/` directory

## Testing the App

1. Open WeChat DevTools
2. Import this project
3. Use AppID: `testappid`
4. Click Compile

The app will:
- Initialize on first launch
- Load 5 pre-installed relationship types into storage
- Show the home page with statistics (all zeros initially)
- Allow navigation to character list (empty initially)

## Next Steps

To make the app fully functional:
1. Add character creation page (`pages/characters/create/`)
2. Add character editing functionality
3. Enhance the relationship detail display
4. Add relationship visualization
5. Implement relationship deduction logic

## Storage Structure

Data is stored in `wx.storage` with these keys:
- `guanxi_types` - Array of relationship type definitions
- `characters` - Array of character/people records
- `guanxi` - Array of relationship records
- `app_initialized` - Initialization flag and metadata
