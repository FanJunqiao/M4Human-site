import os
from pathlib import Path
from moviepy.editor import VideoFileClip

def convert_gif_to_mp4(folder_path: str):
    folder = Path(folder_path)

    if not folder.exists():
        print(f"Folder does not exist: {folder}")
        return

    # Find all .gif files (non-recursive; use rglob('*.gif') for recursive)
    gif_files = list(folder.glob("*.gif"))

    if not gif_files:
        print("No GIF files found in this folder.")
        return

    for gif_path in gif_files:
        mp4_path = gif_path.with_suffix(".mp4")

        # Skip if we already converted this file
        if mp4_path.exists():
            print(f"Skipping (MP4 already exists): {gif_path.name}")
            continue

        print(f"Converting: {gif_path.name} -> {mp4_path.name}")

        try:
            clip = VideoFileClip(str(gif_path))

            # Use clip.fps if available; fall back to 24 fps
            fps = clip.fps if hasattr(clip, "fps") and clip.fps else 24

            clip.write_videofile(
                str(mp4_path),
                codec="libx264",    # H.264 video codec
                audio=False,        # GIFs usually have no audio
                fps=fps
            )

            clip.close()
            print(f"Done: {mp4_path.name}\n")

        except Exception as e:
            print(f"Error converting {gif_path.name}: {e}")

if __name__ == "__main__":
    # TODO: change this to your folder path
    folder_path = "videos_vis/"

    convert_gif_to_mp4(folder_path)
